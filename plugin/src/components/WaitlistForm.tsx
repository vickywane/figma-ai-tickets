import { useForm } from "react-hook-form";
import { fetchClient } from "../utils/fetch";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

interface WaitlistFormData {
  email: string;
  feedback: string;
}

export const WaitlistForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WaitlistFormData>();

  const [submitted, setSubmission] = useState(false);

  const onSubmit = async ({ email, feedback }: WaitlistFormData) => {
    try {
      await fetchClient("functions/v1/waitlist", {
        data: {
          email,
          feedback,
        },
        method: "POST",
      });

      setSubmission(true);
      reset();
    } catch (error) {}
  };

  return (
    <div className="max-w-md h-full mx-auto bg-white p-4">
      <div className="flex justify-center">
        <div className="py-1 px-3 mb-1 rounded-full bg-gray-100 text-xs">
          Coming soon
        </div>
      </div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-roboto text-gray-900 mb-2">
          One-Click Design Tickets
        </h2>
        <p className="text-gray-600 text-sm">
          Be the first to know when FigTicket launches!
        </p>
      </div>

      {submitted ? (
        <div className="grid gap-16">
          <div>
            <div className="flex justify-center" >
              <div className="h-8 w-8 rounded-full flex item-center justify-center">
                <FiCheckCircle className="text-2xl text-green-500" />
              </div>
            </div>

            <p className="text-center text-gray-600 text-sm">
              Thank you for your interest! <br /> We'll notify you when we
              launch.
            </p>
          </div>

          <Link to={"/"}>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
            >
              Try Free Demo
            </button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className={`w-full text-xs px-2 py-3 border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.email
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 bg-gray-50"
              }`}
              placeholder="Your email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="feedback"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tried the demo (optional)?
            </label>
            <textarea
              id="feedback"
              rows={4}
              {...register("feedback")}
              className={`w-full text-xs px-2 py-3 border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none`}
              placeholder="After trying the demo, was the ticket description accurate? Any feedback?"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
          >
            Get Notified
          </button>
        </form>
      )}
    </div>
  );
};
