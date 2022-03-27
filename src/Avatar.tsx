import VisuallyHidden from '@reach/visually-hidden'
import React, { useEffect, useState } from 'react'
import supabase from './supabaseClient'

function Avatar({ url, size, onUpload = (filepath) => {} }: { url?: string | null, size?: number, onUpload?: (filepath: string) => void }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (url) downloadImage(url)
  }, [])

  const downloadImage = async (path: string) => {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)

      if (error) throw error
      if (!data) return

      console.log(data)

      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error: any) {
      console.log('Error downloading image: ', error.message)
    }
  }

  const uploadAvatar = async (event: any) => {
    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)

    } catch (error: any) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }
  return (
    <div style={{ width: size }} aria-live="polite">
      <img
        src={avatarUrl ? avatarUrl : `https://place-hold.it/${size}x${size}`}
        alt={avatarUrl ? 'Avatar' : 'No image'}
        className="avatar image"
        style={{ height: size, width: size }}
      />
      {uploading ? "Uploading..." : (
        <>
          <label className="button primary block" htmlFor="single">
            Upload an avatar
          </label>
          <VisuallyHidden>
            <input
              type="file"
              id="single"
              accept="image/*"
              onChange={uploadAvatar}
              disabled={uploading}
            />
          </VisuallyHidden>
        </>
      )}
    </div>
  )
}

export default Avatar