'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FilmIcon,
  PlusIcon,
  ClockIcon,
  RectangleStackIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid'

interface Project {
  id: string
  title: string
  style: string
  duration: number
  status: string
  scene_count: number
  created_at: string
}

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-green-500/10 text-green-400 border-green-500/20',
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  failed: 'bg-red-500/10 text-red-400 border-red-500/20',
}

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_STYLES[status] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  const Icon = status === 'completed' ? CheckCircleIcon : ExclamationCircleIcon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${cls}`}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  )
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/autonomous/projects')
      .then(r => {
        if (!r.ok) throw new Error(`Server error ${r.status}`)
        return r.json()
      })
      .then(setProjects)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black">
      {/* Header */}
      <header className="border-b border-gray-800/60 backdrop-blur-sm sticky top-0 z-10 bg-gray-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <FilmIcon className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
            <span className="font-bold text-white">AI Film Studio</span>
          </Link>
          <Link
            href="/create"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/30"
          >
            <PlusIcon className="h-4 w-4" />
            New Film
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Your Films</h1>
          <p className="text-gray-400">All projects created by your AI pipeline</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-32 text-gray-400">
            <div className="animate-spin h-8 w-8 border-2 border-purple-400 border-t-transparent rounded-full mr-3" />
            Loading projects…
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <ExclamationCircleIcon className="h-12 w-12 text-red-400 mb-3" />
            <p className="text-red-400 font-medium">Could not load projects</p>
            <p className="text-gray-500 text-sm mt-1">{error}</p>
            <p className="text-gray-500 text-sm">Make sure the backend is running on port 8000.</p>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <SparklesIcon className="h-12 w-12 text-purple-400 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No films yet</h2>
            <p className="text-gray-400 mb-6">Create your first AI-generated film to get started.</p>
            <Link
              href="/create"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              Create Your First Film
            </Link>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
                <Link href={`/projects/${project.id}`}>
                  <div className="relative bg-gray-900/90 border border-gray-800 hover:border-gray-700 rounded-2xl p-6 transition-all duration-300 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <FilmIcon className="h-5 w-5 text-purple-400" />
                      </div>
                      <StatusBadge status={project.status} />
                    </div>

                    <h2 className="text-white font-semibold text-lg leading-snug mb-2 line-clamp-2 flex-1">
                      {project.title}
                    </h2>

                    <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-800 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <SparklesIcon className="h-3.5 w-3.5" />
                        {project.style}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-3.5 w-3.5" />
                        {project.duration}s
                      </span>
                      <span className="flex items-center gap-1">
                        <RectangleStackIcon className="h-3.5 w-3.5" />
                        {project.scene_count} scenes
                      </span>
                      <span className="ml-auto">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
