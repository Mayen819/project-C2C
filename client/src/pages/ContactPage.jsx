import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Compass } from 'lucide-react'
import { api } from '../lib/store.js'

export function Contact() {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  async function submit(e) {
    e.preventDefault()
    const formElement = e.currentTarget
    setStatus('sending')
    setError('')
    const form = new FormData(formElement)
    try {
      await api('/api/messages', {
        method: 'POST',
        body: JSON.stringify({ name: form.get('name'), message: form.get('message') }),
      })
      setStatus('sent')
      formElement.reset()
    } catch (e) {
      setError(e.message)
      setStatus('idle')
    }
  }
  return (
    <main className="page-wrap wrap">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Contact</span>
      </div>
      <div className="contact-layout">
        <div>
          <div className="eyebrow">
            <span /> WE’RE ALL EARS
          </div>
          <h1>
            Drop us
            <br />
            <em>a line.</em>
          </h1>
          <p>
            Questions about a thing, a trail, or anything in between? Send us a note. We usually
            reply within two business days.
          </p>
          <div className="contact-aside">
            <Compass />
            <span>
              Replies usually arrive within
              <br />
              two business days.
            </span>
          </div>
        </div>
        <form className="contact-form" onSubmit={submit}>
          <label htmlFor="message-name">Your name</label>
          <input
            id="message-name"
            name="name"
            required
            minLength="2"
            maxLength="80"
            placeholder="What should we call you?"
          />
          <label htmlFor="message-body">Your note</label>
          <textarea
            id="message-body"
            name="message"
            required
            minLength="5"
            maxLength="1000"
            rows="5"
            placeholder="Tell us what’s on your mind…"
          />
          <p className="demo-note">Please don’t include personal or sensitive information.</p>
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          {status === 'sent' && (
            <p role="status" className="form-success">
              <Check size={16} /> Your note is saved. We appreciate it.
            </p>
          )}
          <button className="button button-dark" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send your note'} <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </main>
  )
}
