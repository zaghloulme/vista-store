'use client'

/**
 * Announcement Bar Component
 * Displays a closable announcement message at the top of the page
 * Closes for the current session only (shows again on next visit)
 */

import { useState, useEffect } from 'react'

interface AnnouncementBarProps {
  message: string
  backgroundColor?: string
  textColor?: string
}

export default function AnnouncementBar({
  message,
  backgroundColor = 'linear-gradient(to right, #3b82f6, #1e40af)',
  textColor = '#ffffff'
}: AnnouncementBarProps) {
  const STORAGE_KEY = 'announcement-bar-closed'
  const [isVisible, setIsVisible] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Check if announcement was closed in this session
    const wasClosed = sessionStorage.getItem(STORAGE_KEY)
    if (wasClosed) {
      setIsVisible(false)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    sessionStorage.setItem(STORAGE_KEY, 'true')
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted || !isVisible) {
    return null
  }

  return (
    <div
      className="relative text-center py-2 text-sm font-medium"
      style={{
        background: backgroundColor,
        color: textColor
      }}
    >
      <div className="container mx-auto px-4 flex items-center justify-center">
        <p>{message}</p>
        <button
          onClick={handleClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close announcement"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
