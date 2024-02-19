import Link from "next/link";

export default function Navigation() {
  return (
    <header className="shadow-lg shadow-gray-100 mb-10">
      <div className="container mx-auto flex max-w-screen-md items-center justify-between px-2 py-3">
        <Link href="/" className="cursor-pointer text-xl font-bold">
          T3Stack入門
        </Link>
      </div>
    </header>
  );
}
