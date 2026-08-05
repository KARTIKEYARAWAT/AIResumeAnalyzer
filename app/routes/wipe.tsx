import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAppStore } from "~/lib/store";
import { supabase } from "~/lib/supabase";

const WipeApp = () => {
    const { auth, isLoading, error, clearError } = useAppStore();
    const navigate = useNavigate();
    const [isWiping, setIsWiping] = useState(false);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading, auth.isAuthenticated, navigate]);

    const handleDelete = async () => {
        if (!auth.user?.id) return;
        setIsWiping(true);
        try {
            // 1. Get all user resumes from DB
            const { data: resumes, error: dbError } = await supabase
                .from("resumes")
                .select("id, resume_path, image_paths")
                .eq("user_id", auth.user.id);
            
            if (dbError) throw dbError;

            // 2. Delete all files from Storage
            if (resumes && resumes.length > 0) {
                const pathsToDelete: string[] = [];
                resumes.forEach((resume) => {
                    if (resume.resume_path) pathsToDelete.push(resume.resume_path);
                    if (resume.image_paths && Array.isArray(resume.image_paths)) {
                        pathsToDelete.push(...resume.image_paths);
                    }
                });

                if (pathsToDelete.length > 0) {
                    const { error: storageError } = await supabase
                        .storage
                        .from("resumes")
                        .remove(pathsToDelete);
                    if (storageError) console.error("Error deleting storage items:", storageError);
                }
            }

            // 3. Delete DB rows
            const { error: deleteError } = await supabase
                .from("resumes")
                .delete()
                .eq("user_id", auth.user.id);
            
            if (deleteError) throw deleteError;

            alert("App data wiped successfully!");
            navigate("/");
        } catch (err) {
            console.error("Wipe failed:", err);
            alert("Failed to wipe data. Check console for details.");
        } finally {
            setIsWiping(false);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error {error}</div>;
    }

    return (
        <div className="p-10 flex flex-col gap-4">
            <div>Authenticated as: {auth.user?.username}</div>
            <div className="flex flex-col gap-2 max-w-md">
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer disabled:opacity-50 w-fit"
                    onClick={() => handleDelete()}
                    disabled={isWiping}
                >
                    {isWiping ? "Wiping..." : "Wipe App Data"}
                </button>
                <p className="text-sm text-gray-500 mt-2">
                    <strong>Warning:</strong> This deletes all analyses permanently. Use{" "}
                    <a href="/history" className="text-blue-600 hover:underline font-semibold">
                        History
                    </a>{" "}
                    to delete individual items instead.
                </p>
            </div>
        </div>
    );
};

export default WipeApp;


