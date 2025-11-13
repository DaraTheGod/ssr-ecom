"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Props {
  selectedCount: number;
}

export default function CartBulkActions({ selectedCount }: Props) {
  const [clearOpen, setClearOpen] = useState(false);
  const [deleteSelOpen, setDeleteSelOpen] = useState(false);

  const clearFormRef = useRef<HTMLFormElement>(null);
  const deleteSelFormRef = useRef<HTMLFormElement>(null);

  return (
    <>
      {/* ---------- Clear All ---------- */}
      <form
        ref={clearFormRef}
        action="/api/cart/clear"
        method="POST"
        className="w-full sm:w-auto"
      >
        <input type="hidden" name="redirect" value="/cart" />
        <Button
          type="button"
          variant="outline"
          onClick={() => setClearOpen(true)}
          className="w-full h-12 font-khmer-toch text-base border-gray-300 hover:bg-gray-100"
        >
          លុបទំនិញក្នុងកន្រ្តកទាំងអស់
        </Button>
      </form>

      <ConfirmDialog
        open={clearOpen}
        title="លុបទាំងអស់?"
        description="តើអ្នកប្រាកដជាចង់លុបទំនិញទាំងអស់ចេញពីកន្ត្រកទេ?"
        onConfirm={() => clearFormRef.current?.requestSubmit()}
        onCancel={() => setClearOpen(false)}
      />

      {/* ---------- Delete Selected ---------- */}
      {selectedCount > 0 && (
        <form
          ref={deleteSelFormRef}
          action="/api/cart/remove-selected"
          method="POST"
          className="w-full sm:w-auto"
        >
          <input type="hidden" name="redirect" value="/cart" />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setDeleteSelOpen(true)}
            className="w-full h-12 font-khmer-toch text-base"
          >
            លុបទំនិញដែលបានជ្រើសរើស ({selectedCount})
          </Button>
        </form>
      )}

      <ConfirmDialog
        open={deleteSelOpen}
        title="លុបទំនិញដែលបានជ្រើសរើស?"
        description={`តើអ្នកប្រាកដជាចង់លុបទំនិញ ${selectedCount} មុខដែលបានជ្រើសរើសទេ?`}
        onConfirm={() => deleteSelFormRef.current?.requestSubmit()}
        onCancel={() => setDeleteSelOpen(false)}
      />
    </>
  );
}