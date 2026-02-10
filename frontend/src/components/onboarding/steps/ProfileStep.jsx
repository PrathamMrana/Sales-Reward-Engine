import { motion } from "framer-motion";

const ProfileStep = ({ formData, setFormData, handleNext }) => {

    return (
        <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-white mb-2">Setup your Profile</h2>
            <p className="text-slate-400 mb-8">Let's verify your details to personalize your experience.</p>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                    <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="e.g. John Doe"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Timezone</label>
                        <select
                            value={formData.timezone}
                            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                        >
                            <option value="UTC">UTC</option>
                            <option value="IST">India (IST)</option>
                            <option value="PST">Pacific Time (PST)</option>
                            <option value="EST">Eastern Time (EST)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Language</label>
                        <select
                            value={formData.language}
                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                        >
                            <option value="en">English (US)</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleNext}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileStep;
