import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Building2, User, Users, FileText, Settings, Rocket } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ProfileStep from "./steps/ProfileStep";
import OrganizationStep from "./steps/OrganizationStep";
import RoleStep from "./steps/RoleStep";
import PolicyStep from "./steps/PolicyStep";
import TeamStep from "./steps/TeamStep";
import FirstActionStep from "./steps/FirstActionStep";
import CompletionStep from "./steps/CompletionStep";

const OnboardingWizard = () => {
    const { auth } = useAuth();
    const isAdmin = auth?.user?.role === "ADMIN";

    // Define steps based on role
    const adminSteps = [
        { id: 1, title: "Profile", icon: User, component: ProfileStep },
        { id: 2, title: "Organization", icon: Building2, component: OrganizationStep },
        { id: 3, title: "Roles", icon: Settings, component: RoleStep },
        { id: 4, title: "Policies", icon: FileText, component: PolicyStep },
        { id: 5, title: "Team", icon: Users, component: TeamStep },
        { id: 6, title: "First Action", icon: Rocket, component: FirstActionStep },
        { id: 7, title: "Complete", icon: Check, component: CompletionStep }
    ];

    const salesSteps = [
        { id: 1, title: "Profile", icon: User, component: ProfileStep },
        { id: 2, title: "Setup", icon: Settings, component: FirstActionStep }, // Simplified flow for sales
        { id: 3, title: "Complete", icon: Check, component: CompletionStep }
    ];

    const steps = isAdmin ? adminSteps : salesSteps;
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        // Profile
        fullName: auth?.user?.name || "",
        timezone: "UTC",
        language: "en",

        // Org (Admin only)
        orgName: "",
        industry: "",
        companySize: "1-10",
        currency: "USD",
        fiscalYear: "Jan-Dec",

        // Roles & Policies (Mock/Placeholder for wizard)
        rolesConfirmed: false,
        policyCreated: false,
        teamInvites: []
    });

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(curr => curr + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(curr => curr - 1);
        }
    };

    const CurrentComponent = steps[currentStep].component;

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-5xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[80vh] md:h-[700px]">

                {/* Sidebar / Stepper */}
                <div className="w-full md:w-80 bg-slate-900/80 border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Rocket className="w-6 h-6 text-indigo-500" />
                            Get Started
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">Complete your setup</p>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 md:space-y-0">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = index === currentStep;
                            const isCompleted = index < currentStep;

                            return (
                                <div
                                    key={step.id}
                                    className={`relative flex items-center md:p-3 rounded-xl transition-all duration-300 ${isActive ? "bg-indigo-500/10 border border-indigo-500/20" : "opacity-60"
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-colors ${isActive ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25" :
                                            isCompleted ? "bg-emerald-500/20 text-emerald-500" : "bg-slate-800 text-slate-500"
                                        }`}>
                                        {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                    </div>
                                    <div className="hidden md:block">
                                        <h3 className={`font-medium ${isActive ? "text-white" : "text-slate-400"}`}>
                                            {step.title}
                                        </h3>
                                        {isActive && (
                                            <p className="text-xs text-indigo-400">In Progress</p>
                                        )}
                                    </div>

                                    {/* Mobile Connector Line */}
                                    {index < steps.length - 1 && (
                                        <div className={`absolute left-5 top-14 w-0.5 h-6 -ml-[1px] md:hidden ${isCompleted ? "bg-emerald-500/30" : "bg-slate-800"
                                            }`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col relative">
                    {/* Header for Mobile */}
                    <div className="md:hidden p-4 border-b border-slate-800 bg-slate-900/50">
                        <span className="text-sm text-slate-400">Step {currentStep + 1} of {steps.length}</span>
                        <h2 className="text-lg font-bold text-white">{steps[currentStep].title}</h2>
                    </div>

                    <div className="flex-1 p-6 md:p-10 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                <CurrentComponent
                                    formData={formData}
                                    setFormData={setFormData}
                                    handleNext={handleNext}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer Controls */}
                    <div className="p-6 border-t border-slate-800 bg-slate-900/30 flex justify-between items-center">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${currentStep === 0
                                    ? "opacity-0 pointer-events-none"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                                }`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                        </button>

                        {/* Note: Start/Next buttons are usually inside the step components for validation control, 
                            but global navigation is here if needed. 
                            We pass handleNext to components so they can trigger it after validation. 
                        */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingWizard;
