import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  TrendingUp,
  Users,
  Zap,
  Target,
  Calculator,
  BarChart3,
  CheckCircle2,
  FileCheck,
  Settings,
  Bell,
  Lock,
  FileText,
  GitBranch,
  Layers
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-bg-secondary transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-accent-500/10 to-transparent dark:from-primary-600/20 dark:via-accent-600/20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-32 sm:pb-40">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-1 border border-border-subtle mb-8">
              <Zap className="w-4 h-4 text-accent-500" />
              <span className="text-sm font-medium text-text-secondary">Enterprise Sales Performance Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="block text-text-primary">Sales Reward</span>
              <span className="block text-gradient bg-gradient-to-r from-primary-500 to-accent-500">Engine</span>
            </h1>

            {/* Subheadline */}
            <p className="max-w-3xl mx-auto text-xl sm:text-2xl text-text-secondary mb-10 leading-relaxed">
              A role-based platform for managing sales performance, incentives, and approvals at scale.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/login')}
                className="btn-primary px-8 py-4 text-lg font-semibold flex items-center gap-2 group"
              >
                Login
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={scrollToFeatures}
                className="btn-secondary px-8 py-4 text-lg font-semibold"
              >
                Explore Features
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 text-text-muted">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Secure Authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                <span className="text-sm">Role-Based Access</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span className="text-sm">Audit Trails</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 bg-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Drive Performance, Ensure Accuracy, Scale with Confidence
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Built for modern sales organizations that demand transparency, efficiency, and growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                title: 'Performance Visibility',
                description: 'Track deals, incentives, and growth with real-time insights.'
              },
              {
                icon: Target,
                title: 'Incentive Accuracy',
                description: 'Centralized policies ensure fair, transparent incentive calculations.'
              },
              {
                icon: Users,
                title: 'Role-Based Control',
                description: 'Separate admin governance and sales execution with secure access.'
              },
              {
                icon: Layers,
                title: 'Scalability',
                description: 'Designed to grow from small teams to enterprise sales organizations.'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="glass-card p-6 hover:scale-105 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-secondary leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              How It Works
            </h2>
            <p className="text-lg text-text-secondary">
              Simple, powerful workflow in four steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: '01',
                title: 'Admin defines incentive policies',
                icon: Settings
              },
              {
                number: '02',
                title: 'Deals are assigned or created',
                icon: FileCheck
              },
              {
                number: '03',
                title: 'Sales executives submit deals',
                icon: TrendingUp
              },
              {
                number: '04',
                title: 'Incentives are approved and tracked',
                icon: CheckCircle2
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4 shadow-neon">
                    <span className="text-2xl font-bold text-white">{step.number}</span>
                  </div>
                  <step.icon className="w-8 h-8 text-accent-500 mb-3" />
                  <p className="text-text-primary font-medium">{step.title}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 opacity-30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 bg-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Comprehensive Feature Set
            </h2>
            <p className="text-lg text-text-secondary">
              Everything you need to manage sales performance and incentives
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Sales Executive Features */}
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary">Sales Executive</h3>
              </div>
              <ul className="space-y-3">
                {[
                  { icon: BarChart3, text: 'Deals & Performance Tracking' },
                  { icon: Calculator, text: 'Incentive Simulator' },
                  { icon: Target, text: 'Targets & Growth Metrics' },
                  { icon: FileText, text: 'Earnings & Reports' }
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-text-secondary">
                    <feature.icon className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Admin Features */}
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary">Admin</h3>
              </div>
              <ul className="space-y-3">
                {[
                  { icon: CheckCircle2, text: 'Deal Approvals' },
                  { icon: Settings, text: 'Policy Management & Simulation' },
                  { icon: Users, text: 'Sales Team Management' },
                  { icon: Bell, text: 'Audit Logs & Alerts' }
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-text-secondary">
                    <feature.icon className="w-5 h-5 text-accent-500 flex-shrink-0" />
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Design Emphasis */}
      <section className="py-20 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-6">
                Designed for Two Perspectives
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Sales Users</h3>
                    <p className="text-text-secondary">
                      Motivational, earnings-focused dashboards that drive performance and provide clear visibility into goals and achievements.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-accent-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">Admin Users</h3>
                    <p className="text-text-secondary">
                      Governance-focused controls with approvals, analytics, and comprehensive oversight of the entire sales organization.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-6 text-center">
                <div className="text-3xl font-bold text-gradient bg-gradient-to-r from-primary-500 to-primary-600 mb-2">100%</div>
                <p className="text-sm text-text-secondary">Transparent Calculations</p>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="text-3xl font-bold text-gradient bg-gradient-to-r from-accent-500 to-accent-600 mb-2">Real-time</div>
                <p className="text-sm text-text-secondary">Performance Insights</p>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="text-3xl font-bold text-gradient bg-gradient-to-r from-primary-500 to-accent-500 mb-2">Secure</div>
                <p className="text-sm text-text-secondary">Role-Based Access</p>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="text-3xl font-bold text-gradient bg-gradient-to-r from-accent-500 to-primary-500 mb-2">Scalable</div>
                <p className="text-sm text-text-secondary">Enterprise Ready</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Quality Signals */}
      <section className="py-20 bg-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Built for Enterprise Trust
            </h2>
            <p className="text-lg text-text-secondary">
              Security, compliance, and reliability at the core
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Lock, title: 'Secure Authentication', description: 'Industry-standard security protocols' },
              { icon: FileText, title: 'Audit Trails', description: 'Complete activity logging and tracking' },
              { icon: GitBranch, title: 'Policy Versioning', description: 'Track and manage policy changes over time' },
              { icon: Layers, title: 'Scalable Architecture', description: 'Built to grow with your organization' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto mb-4 flex items-center justify-center shadow-glow">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-500/10 via-accent-500/10 to-transparent dark:from-primary-600/20 dark:via-accent-600/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-6">
            Get Started with Sales Reward Engine
          </h2>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Join modern sales organizations that leverage our platform to drive performance, ensure accuracy, and scale with confidence.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary px-10 py-4 text-lg font-semibold flex items-center gap-2 mx-auto group"
          >
            Login to Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-secondary border-t border-border-subtle py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Sales Reward Engine</h3>
              <p className="text-text-secondary text-sm">
                Enterprise sales performance and incentive management platform
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-3">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-surface-1 border border-border-subtle rounded-full text-xs text-text-secondary">React</span>
                <span className="px-3 py-1 bg-surface-1 border border-border-subtle rounded-full text-xs text-text-secondary">Spring Boot</span>
                <span className="px-3 py-1 bg-surface-1 border border-border-subtle rounded-full text-xs text-text-secondary">MySQL</span>
                <span className="px-3 py-1 bg-surface-1 border border-border-subtle rounded-full text-xs text-text-secondary">TailwindCSS</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-3">Features</h4>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>Role-Based Access Control</li>
                <li>Real-time Analytics</li>
                <li>Policy Management</li>
                <li>Audit & Compliance</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border-subtle text-center text-sm text-text-muted">
            <p>© {new Date().getFullYear()} Sales Reward Engine. Built for enterprise sales teams.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
