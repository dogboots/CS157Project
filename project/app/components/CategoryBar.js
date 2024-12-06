// components/CategoryBar.js

import Link from "next/link";

export default function CategoryBar() {
  return (
    <div>
      <div className="flex">
        <div className="w-64 bg-[#457B9D] text-white h-screen p-5">
          <h3 className="text-xl font-bold mb-5">Categories</h3>
          <hr class="h-px my-4 bg-red-50 border-0 dark:bg-grey-100"/>
          <ul className="space-y-4">
            <li>
              <Link href="/categories/electronics" className="text-lg hover:text-gray-400">
                Electronics
              </Link>
            </li>
            <li>
              <Link href="/categories/fashion" className="text-lg hover:text-gray-400">
                Fashion
              </Link>
            </li>
            <li>
              <Link href="/categories/homekitchen" className="text-lg hover:text-gray-400">
                Home & Kitchen
              </Link>
            </li>
            <li>
              <Link href="/categories/books" className="text-lg hover:text-gray-400">
                Books
              </Link>
            </li>
            <li>
              <Link href="/categories/toys" className="text-lg hover:text-gray-400">
                Toys
              </Link>
            </li>
            <li>
              <Link href="/categories/sports" className="text-lg hover:text-gray-400">
                Sports
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
