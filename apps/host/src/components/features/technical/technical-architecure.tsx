import { useState, useEffect } from 'react';
import { 
  GitBranch, 
  Zap, 
  Package, 
  Network, 
  Code2, 
  Rocket,
  Shield,
  ExternalLink,
  CheckCircle,
  Circle
} from 'lucide-react';
import { Header } from '../../header';
export const TechnicalArchitecture = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [serviceStatus, setServiceStatus] = useState({
    host: 'online',
    dashboard: 'online', 
    calendar: 'online',
    notes: 'loading',
    focus: 'online'
  });

  // Simulate service status updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setServiceStatus(prev => ({ ...prev, notes: 'online' }));
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const architectureData = {
    overview: {
      title: "Microfrontend Architecture",
      description: "Enterprise-grade modular architecture with independent deployments",
      features: [
        "Module Federation for runtime composition",
        "Independent development & deployment",
        "Shared design system & utilities",
        "Real-time auth state synchronization"
      ]
    },
    stack: {
      title: "Modern Tech Stack",
      description: "Cutting-edge tools for performance and developer experience",
      technologies: [
        { name: "React 19", purpose: "Latest React features", icon: "⚛️" },
        { name: "TypeScript", purpose: "Type safety", icon: "🔷" },
        { name: "Module Federation", purpose: "Microfrontends", icon: "🔗" },
        { name: "Turborepo", purpose: "Monorepo tooling", icon: "⚡" },
        { name: "Tailwind v4", purpose: "CSS engine", icon: "🎨" },
        { name: "Vite", purpose: "Build tool", icon: "⚡" }
      ]
    },
    deployment: {
      title: "Independent Deployments", 
      description: "Each microfrontend deploys independently with zero downtime",
      metrics: [
        { label: "Build Time", value: "< 30s", trend: "↓" },
        { label: "Bundle Size", value: "< 100kb", trend: "↓" },
        { label: "Load Time", value: "< 1.2s", trend: "↓" },
        { label: "Uptime", value: "99.9%", trend: "↑" }
      ]
    }
  };

  const microfrontends = [
    { 
      name: "Host Shell", 
      port: "3000", 
      status: serviceStatus.host,
      description: "Main orchestrator",
      tech: ["TanStack Router", "Clerk Auth"]
    },
    { 
      name: "Dashboard", 
      port: "3001", 
      status: serviceStatus.dashboard,
      description: "Productivity hub",
      tech: ["Zustand", "Weather API"]
    },
    { 
      name: "Calendar", 
      port: "3002", 
      status: serviceStatus.calendar,
      description: "Event management",
      tech: ["Date-fns", "Event System"]
    },
    { 
      name: "Notes", 
      port: "3003", 
      status: serviceStatus.notes,
      description: "Note taking",
      tech: ["Rich Text", "Auto-save"]
    },
    { 
      name: "Focus", 
      port: "3004", 
      status: serviceStatus.focus,
      description: "Productivity tools",
      tech: ["Pomodoro", "Analytics"]
    }
  ];

  const StatusIndicator = ({ status }: { status: 'online' | 'loading' | 'offline' }) => {
    const colors = {
      online: "text-green-400",
      loading: "text-yellow-400", 
      offline: "text-red-400"
    };
    
    const Icon = status === 'online' ? CheckCircle : Circle;
    
    return (
      <div className="flex items-center gap-2">
        <Icon className={`w-3 h-3 ${colors[status]}`} />
        <span className={`text-xs ${colors[status]} capitalize`}>
          {status}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white w-full">
      <Header />
    <div className="min-h-screen bg-gray-900 text-white p-8 w-full">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
            <Code2 className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">Engineering Deep Dive</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Built for Scale
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            This isn't just another productivity app. It's a showcase of modern frontend architecture, 
            demonstrating enterprise-level engineering practices and cutting-edge technology.
          </p>
        </div>
        

        {/* Architecture Diagram */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-center">Live Microfrontend Architecture</h3>
          
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            {microfrontends.map((service) => (
              <div key={service.name} className="relative flex-1 min-w-[23  0px] max-w-xs">
                {/* Connection Lines */}
                {/* Removed for flex layout */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-purple-500/50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-purple-400">:{service.port}</div>
                    <StatusIndicator status={service.status as 'online' | 'loading' | 'offline'} />
                  </div>
                  
                  <h4 className="font-semibold mb-2">{service.name}</h4>
                  <p className="text-sm text-gray-400 mb-3">{service.description}</p>
                  
                  <div className="space-y-1">
                    {service.tech.map(tech => (
                      <div key={tech} className="text-xs bg-gray-700 px-2 py-1 rounded inline-block mr-1">
                        {tech}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-400">
              <Network className="w-4 h-4" />
              Runtime composition via Module Federation
            </div>
          </div>
        </div>

        {/* Interactive Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
          
          {/* Section Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-2">
              {Object.keys(architectureData).map(section => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    activeSection === section 
                      ? 'bg-purple-500/20 border-l-4 border-purple-500 text-purple-400' 
                      : 'bg-gray-800 hover:bg-gray-750 text-gray-300'
                  }`}
                >
                  <div className="font-medium capitalize">{section}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
              {activeSection === 'overview' && (
                <div>
                  <h3 className="text-2xl font-bold mb-4">{architectureData.overview.title}</h3>
                  <p className="text-gray-300 mb-6">{architectureData.overview.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {architectureData.overview.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-750 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'stack' && (
                <div>
                  <h3 className="text-2xl font-bold mb-4">{architectureData.stack.title}</h3>
                  <p className="text-gray-300 mb-6">{architectureData.stack.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {architectureData.stack.technologies.map((tech, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-gray-750 rounded-lg">
                        <div className="text-2xl">{tech.icon}</div>
                        <div>
                          <div className="font-medium">{tech.name}</div>
                          <div className="text-sm text-gray-400">{tech.purpose}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'deployment' && (
                <div>
                  <h3 className="text-2xl font-bold mb-4">{architectureData.deployment.title}</h3>
                  <p className="text-gray-300 mb-6">{architectureData.deployment.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {architectureData.deployment.metrics.map((metric, index) => (
                      <div key={index} className="text-center p-4 bg-gray-750 rounded-lg">
                        <div className="text-2xl font-bold text-purple-400 mb-1">
                          {metric.value}
                          <span className="text-sm ml-1 text-green-400">{metric.trend}</span>
                        </div>
                        <div className="text-sm text-gray-400">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Development Experience */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-750 border border-gray-700 rounded-lg p-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Developer Experience</h3>
              <p className="text-gray-300 mb-6">
                Built with modern tooling for exceptional developer productivity and maintainability.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span>Hot module replacement across microfrontends</span>
                </div>
                <div className="flex items-center gap-3">
                  <GitBranch className="w-5 h-5 text-blue-400" />
                  <span>Independent development workflows</span>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-green-400" />
                  <span>Shared design system and utilities</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <span>Type-safe across module boundaries</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-400 ml-2">Terminal</span>
              </div>
              
              <div className="font-mono text-sm space-y-2">
                <div className="text-green-400">$ pnpm dev</div>
                <div className="text-gray-400">🚀 Host app running on :3000</div>
                <div className="text-gray-400">📊 Dashboard running on :3001</div>
                <div className="text-gray-400">📅 Calendar running on :3002</div>
                <div className="text-purple-400">✨ Module Federation active</div>
                <div className="text-blue-400 animate-pulse">🔄 Hot reloading enabled</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4">
            <a 
              href="https://github.com/yourusername/taskmaster-ai" 
              className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 px-6 py-3 rounded-lg transition-colors"
            >
              <Code2 className="w-4 h-4" />
              View Source Code
              <ExternalLink className="w-4 h-4" />
            </a>
            
            <a 
              href="/dashboard" 
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors"
            >
              <Rocket className="w-4 h-4" />
              Explore the App
            </a>
          </div>
          
          <p className="text-sm text-gray-400 mt-4">
            Built with modern practices • Scalable architecture • Developer-first approach
          </p>
        </div>

        </div>
      </div>
    </div>
  );
};