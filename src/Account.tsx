import React, { ChangeEventHandler, useEffect, useState } from 'react'
import Avatar from './Avatar'
import supabase from './supabaseClient'

interface AccountProps {
  session: {
    user: {
      email: string
    }
  }
}

function Account({ session }: AccountProps) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    getProfile()
  }, [session])

  const getProfile = async () => {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      let  { data, error, status } = await supabase.from('profiles').select('username, website, avatar_url').eq('id', user?.id).single()

      if (error && status !== 406) throw error

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (e?: React.FormEvent<HTMLFormElement>, payload?: {}) => {
    if (e) e.preventDefault()

    try {
      setLoading(true)
      const user = supabase.auth.user()
      let updates: any = {
        id: user?.id,
      }

      if (payload) {
        updates = {
          ...updates,
          ...payload
        }
      } else {
        updates = {
          ...updates,
          username,
          website,
          avatar_url,
          updated_at: new Date()
        }
      }


      let { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal'
      })

      if (error) throw error

    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div aria-live="polite">
      {loading ? (
        'Saving ...'
      ) : (
        <form onSubmit={updateProfile} className="form-widget">
          <Avatar
            url={avatar_url}
            size={150}
            onUpload={(url) => {
              setAvatarUrl(url)
              updateProfile(undefined, { username, website, avatar_url: url })
            }}
          />
          <div>Email: {session.user.email}</div>
          <div>
            <label htmlFor="username">Name</label>
            <input
              id="username"
              type="text"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="url"
              value={website || ''}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div>
            <button className="button block primary" disabled={loading}>
              Update profile
            </button>
          </div>
        </form>
      )}
      <button type="button" className="button block" onClick={() => supabase.auth.signOut()}>
        Sign Out
      </button>
    </div>
  )
}

export default Account