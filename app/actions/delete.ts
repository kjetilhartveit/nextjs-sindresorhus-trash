"use server";

import trash from "trash";

export async function deleteAction() {
  await trash("*.txt");
}
