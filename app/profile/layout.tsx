import ProfileSidebar from "@/components/ProfileSidebar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col w-full md:flex-row'>
      <div className='w-full h-auto sticky left-0 md:w-48 md:min-h-screen border-0 md:border-r-2 border-l-foreground'>
        <ProfileSidebar />
      </div>
      {children}
    </div>
  );
}
