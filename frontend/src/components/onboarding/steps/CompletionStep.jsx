import { useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import axios from "axios";

const CompletionStep = () => {
    const { auth, login } = useAuth(); // We need login to update the local auth state
    const navigate = useNavigate();

    useEffect(() => {
        const completeOnboarding = async () => {
            try {
                // Update backend
                await axios.post(`http://localhost:8080/api/onboarding/complete/${auth.user.id}`);

                // Update local storage via auth context re-login logic
                // Construct new auth object with onboardingCompleted = true
                const updatedAuth = {
                    ...auth,
                    onboardingCompleted: true,
                    // If user object is nested, update that too if necessary, 
                    // but the boolean is usually top-level in our response map now
                };

                // Wait for confetti effect
                setTimeout(() => {
                    login(updatedAuth); // Refresh context state
                    navigate(auth.role === "ADMIN" ? "/admin" : "/sales");
                }, 3000);

            } catch (error) {
                console.error("Failed to complete onboarding", error);
            }
        };

        completeOnboarding();
    }, []);

    return (
        <div className="h-full flex flex-col items-center justify-center text-center relative">
            <Confetti numberOfPieces={200} recycle={false} />

            <h2 className="text-4xl font-bold text-white mb-4">You're All Set!</h2>
            <p className="text-slate-400 text-lg">Redirecting you to your dashboard...</p>
        </div>
    );
};

export default CompletionStep;
