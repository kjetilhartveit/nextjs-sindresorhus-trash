"use client";

import { startTransition } from "react";
import { deleteAction } from "../actions/delete";

export function FileDeleteButton() {
  const onClickDelete = () => {
    const result = startTransition(async () => {
      await deleteAction();
    });
    return result;
  };

  return (
    <button
      className="border rounded p-2 bg-black cursor-pointer"
      onClick={onClickDelete}
    >
      Attempt to delete file
    </button>
  );
}
