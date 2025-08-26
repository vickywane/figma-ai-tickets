import { Link } from "react-router";

export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <div className="max-w-[300px] w-full space-y-6 px-4">
          <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <p className="leading-6 text-gray-700 dark:text-gray-200 text-center">
              Home Page
            </p>

            <Link to="/dashboard" className="block text-center">
              Go to Dashboard
            </Link>

            <Link to="/login" className="block text-center">
              Go to Login
            </Link>
          </nav>
        </div>
      </div>
    </main>
  );
}
