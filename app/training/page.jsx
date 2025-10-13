import Link from 'next/link';
import TrainingDashboard from '../components/TrainingDashboard';

export default function TrainingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">Health Hub Training</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Dashboard
              </Link>
              <Link
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link href="/" className="text-gray-400 hover:text-gray-500">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-4 text-gray-500">Training</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Mandatory & Statutory Training
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Comprehensive training program covering all mandatory and statutory requirements 
            for support workers in the UK healthcare sector. Complete your training modules 
            to ensure compliance and maintain professional standards.
          </p>
        </div>

        {/* Training Dashboard */}
        <TrainingDashboard />

        {/* Additional Information */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            Training Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-blue-800 mb-2">Compliance Requirements</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• All modules are mandatory for UK healthcare workers</li>
                <li>• Certificates valid for 12-24 months depending on module</li>
                <li>• Regular refresher training required</li>
                <li>• Evidence-based assessment methods</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-800 mb-2">Assessment Types</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• <strong>Quiz:</strong> Multiple choice knowledge assessment</li>
                <li>• <strong>Practical:</strong> Hands-on skill demonstration</li>
                <li>• <strong>Scenario:</strong> Case study problem solving</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Health Hub Training. All rights reserved.</p>
            <p className="mt-2 text-sm">
              Training content complies with UK healthcare regulations and statutory requirements.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
