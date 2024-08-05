import { FileDeleteButton } from "./components/FileDeleteButton";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="">
        <FileDeleteButton />
      </div>
    </main>
  );
}
