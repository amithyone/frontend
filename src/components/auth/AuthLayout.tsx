import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  image: string;
  title: ReactNode; // Changed from string to ReactNode
  subtitle: string;
  footer?: ReactNode;
}

export function AuthLayout({
  children,
  image,
  title,
  subtitle,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src={image}
          alt="Auth background"
          className="w-full h-full object-cover"
        />
        {/* Text overlay positioned at bottom middle */}
        <div className="absolute bottom-12 left-0 right-0 px-12">
          <div className="max-w-xl mx-auto">
            <h1 className="text-6xl font-bold text-white mb-3 leading-tight">
              {title}
            </h1>
            <p className="text-5xl text-white font-bold">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {children}
        </div>
        {footer && <div className="mt-8">{footer}</div>}
      </div>
    </div>
  );
}