// src/app/(shop)/cart/_components/CartBulkActions.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Props {
  selectedCount: number;
}

export default function CartBulkActions({ selectedCount }: Props) {
  const [clearAllOpen, setClearAllOpen] = useState(false);
  const [deleteSelOpen, setDeleteSelOpen] = useState(false);

  return (
    <>
      {/* Clear All */}
      <Button
        variant="outline"
        onClick={() => setClearAllOpen(true)}
        className="w-full sm:w-auto h-12 font-khmer-toch text-base border-gray-300 hover:bg-gray-100"
      >
        លុបទំនិញក្នុងកន្រ្តកទាំងអស់
      </Button>

      {/* Delete Selected */}
      {selectedCount > 0 && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setDeleteSelOpen(true)}
          className="w-full sm:w-auto h-12 font-khmer-toch text-base"
        >
          លុបទំនិញដែលបានជ្រើសរើស ({selectedCount})
        </Button>
      )}

      {/* Confirm: Clear All */}
      <ConfirmDialog
        open={clearAllOpen}
        title="លុបទាំងអស់?"
        description="តើអ្នកប្រាកដជាចង់លុបទំនិញទាំងអស់ចេញពីកន្ត្រកទេ?"
        onConfirm={() => (window.location.href = "/api/cart/clear?redirect=/cart")}
        onCancel={() => setClearAllOpen(false)}
      />

      {/* Confirm: Delete Selected */}
      <ConfirmDialog
        open={deleteSelOpen}
        title="លុបទំនិញដែលបានជ្រើសរើស?"
        description={`តើអ្នកប្រាកដជាចង់លុបទំនិញ ${selectedCount} មុខដែលបានជ្រើសរើសទេ?`}
        onConfirm={() => (window.location.href = "/api/cart/remove-selected?redirect=/cart")}
        onCancel={() => setDeleteSelOpen(false)}
      />
    </>
  );
}