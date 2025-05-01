

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className='flex items-center justify-center h-screen border border-red-500 flex-grow'>
    {children}
  </div>
}