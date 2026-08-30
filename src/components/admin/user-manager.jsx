"use client";

import { useTransition } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteActionDialog } from "@/components/admin/action-forms";
import { updateUserRole, deleteUser } from "@/lib/actions/admin-actions";

const ROLE_META = {
  USER: { label: "کاربر", variant: "secondary" },
  ADMIN: { label: "مدیر", variant: "default" },
};

function RoleSelect({ id, current }) {
  const [pending, startTransition] = useTransition();
  const handle = (e) => {
    const formData = new FormData();
    formData.set("id", id);
    formData.set("role", e.target.value);
    startTransition(async () => {
      await updateUserRole(formData);
    });
  };
  return (
    <select
      defaultValue={current}
      onChange={handle}
      disabled={pending}
      className="h-8 rounded-lg border border-border bg-background px-2 text-xs outline-none focus-visible:border-ring cursor-pointer"
    >
      <option value="USER">کاربر</option>
      <option value="ADMIN">مدیر</option>
    </select>
  );
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

export default function UserManager({ users }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">کاربران ({users.length})</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>نام</TableHead>
            <TableHead>تلفن</TableHead>
            <TableHead>ایمیل</TableHead>
            <TableHead>تاریخ عضویت</TableHead>
            <TableHead>نقش</TableHead>
            <TableHead>تغییر نقش</TableHead>
            <TableHead className="text-start">حذف</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                کاربری وجود ندارد
              </TableCell>
            </TableRow>
          )}
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell dir="ltr" className="text-sm">{user.phone}</TableCell>
              <TableCell dir="ltr" className="text-xs text-muted-foreground">{user.email}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(user.createdAt)}
              </TableCell>
              <TableCell>
                <Badge variant={ROLE_META[user.role].variant}>{ROLE_META[user.role].label}</Badge>
              </TableCell>
              <TableCell>
                <RoleSelect id={user.id} current={user.role} />
              </TableCell>
              <TableCell>
                <DeleteActionDialog
                  action={deleteUser}
                  id={user.id}
                  title="حذف کاربر"
                  description={`آیا از حذف کاربر «${user.name}» مطمئن هستید؟`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}