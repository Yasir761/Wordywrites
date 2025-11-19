import { toast } from "sonner";

export function showToast({
  type = "info",
  title,
  description,
}: {
  type?: "success" | "error" | "info" | "warning";
  title: string;
  description?: string;
}) {
  switch (type) {
    case "success":
      toast.success(title, { description });
      break;

    case "error":
      toast.error(title, { description });
      break;

    case "warning":
      toast.warning(title, { description });
      break;

    default:
      toast(title, { description });
      break;
  }
}
