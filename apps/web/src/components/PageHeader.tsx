import React, { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  className?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, className = '', action }: PageHeaderProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
          <p className="text-gray-300 text-lg">{description}</p>
        </div>
        {action && <div className="ml-4">{action}</div>}
      </div>
    </div>
  );
}
