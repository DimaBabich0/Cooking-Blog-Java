import { useState } from 'react'
import Button from '../../components/Button/Button'
import styles from './ContactPage.module.scss'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    enquiryType: 'Advertising',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError(null)
    setSuccess(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      // TODO: Implement actual form submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.')
      setFormData({
        name: '',
        email: '',
        subject: '',
        enquiryType: 'Advertising',
        message: ''
      })
    } catch (err) {
      setError('Ошибка отправки сообщения. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.contact}>
      <div className="container">
        <div className={styles.contact_content}>
          <div className={styles.contact_image}>
            {/* Placeholder для изображения повара */}
            <div className={styles.image_placeholder}>
              <span>👨‍🍳</span>
            </div>
          </div>

          <div className={styles.contact_form_wrapper}>
            <h1>Contact us</h1>
            
            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="name">NAME</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter your name..."
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email">EMAIL ADDRESS</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Your email address..."
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="subject">SUBJECT</label>
                <input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  placeholder="Enter subject..."
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="enquiryType">ENQUIRY TYPE</label>
                <select
                  id="enquiryType"
                  value={formData.enquiryType}
                  onChange={(e) => handleChange('enquiryType', e.target.value)}
                  className={styles.select}
                >
                  <option value="Advertising">Advertising</option>
                  <option value="General">General</option>
                  <option value="Support">Support</option>
                  <option value="Partnership">Partnership</option>
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="message">MESSAGES</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="Enter your messages..."
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? 'Отправка...' : 'Submit'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
