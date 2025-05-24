import { Brain, Share2, Youtube, Twitter ,ArrowRight, Zap } from "lucide-react"
import { Link } from "react-router-dom"
import { features, steps, techStack } from "../utils"

export default function BrainlyLanding() {


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Brainly</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/signin" className="px-4 py-2 border rounded-md bg-purple-200 text-purple-600 hover:text-gray-900 transition-colors font-medium">
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="flex justify-center mb-6">
            <div className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Your Personal Content Vault
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Save, Organize & Share
            <span className="text-blue-600 block">Your Favorite Content</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Brainly is your personal "watch later" vault for YouTube and Twitter content. Save links with custom titles,
            organize them, and share collections with anyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-6 py-4 bg-blue-600 text-white text-lg font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Start Building Your Brain
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <div className="flex items-center justify-center gap-8 mt-12 text-gray-500">
            <div className="flex items-center gap-2">
              <Youtube className="h-6 w-6 text-red-500" />
              <span>YouTube</span>
            </div>
            <div className="flex items-center gap-2">
              <Twitter className="h-6 w-6 text-blue-500" />
              <span>Twitter</span>
            </div>
            <div className="flex items-center gap-2">
              <Share2 className="h-6 w-6 text-green-500" />
              <span>Easy Sharing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features for Content Management</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to save, organize, and share your favorite content efficiently.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  {<feature.icon className="w-6 h-6"/>}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Brainly Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes with our simple 4-step process.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Built with Modern Technology</h2>
          <p className="text-lg text-gray-600 mb-12">
            Powered by industry-leading tools and frameworks for optimal performance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, index) => (
              <span key={index} className={`px-4 py-2 text-sm font-medium rounded-full ${tech.color}`}>
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Build Your Brain?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who are already organizing their content with Brainly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-6 py-4 bg-white text-blue-600 text-lg font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">Brainly</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Your personal content vault for saving and sharing YouTube and Twitter links. Built with modern web
                technologies for the best user experience.
              </p>
              <div className="flex gap-4">
                <Link
                  to="https://github.com/devnick10/brainly-app"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  GitHub
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/demo" className="hover:text-white transition-colors">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/docs" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Brainly App. Built by{" "}
              <Link to="https://github.com/devnick10" className="text-blue-400 hover:text-blue-300 transition-colors">
                @devnick10
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
