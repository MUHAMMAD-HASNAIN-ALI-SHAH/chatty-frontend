import { AppSidebar } from "@/components/home/AppSidebar"
import Main from "@/components/home/Main"
import { SidebarProvider } from "@/components/ui/sidebar"
import { getChats } from "@/slices/chatStore";
import type { AppDispatch } from "@/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getChats());
  }, [dispatch]);

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <Main />
        </main>
      </SidebarProvider>
    </div>
  )
}

export default Home
