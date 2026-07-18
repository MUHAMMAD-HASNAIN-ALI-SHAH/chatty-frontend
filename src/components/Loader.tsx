import { Loader2 } from "lucide-react"

const Loader = () => {
    return (
        <div className="w-full h-screen flex justify-center items-center">
            <Loader2 className="animate-spin text-blue-600 size-6" />
        </div>
    )
}

export default Loader
