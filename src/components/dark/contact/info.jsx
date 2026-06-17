import React, { useState } from 'react';
import './info.css';

function Info() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear any existing status messages when user starts typing
    if (status.message) {
      setStatus({ type: '', message: '' });
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setStatus({ type: 'error', message: 'Please enter your name' });
      return false;
    }
    if (!formData.email.trim()) {
      setStatus({ type: 'error', message: 'Please enter your email' });
      return false;
    }
    if (!formData.message.trim()) {
      setStatus({ type: 'error', message: 'Please enter your message' });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const recipient = 'chamudithaperera.dev@gmail.com';
      const subject = encodeURIComponent(
        formData.subject || `Portfolio inquiry from ${formData.name}`
      );
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
      );

      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
      setStatus({
        type: 'success',
        message: 'Your email app should open with the message prefilled.',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Could not open your email app. Please email me directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sec-box contact section-padding bord-thin-top" id="info">
      <div className="row">
        <div className="col-lg-5">
          <div className="sec-head md-mb80 wow fadeIn">
            <h6 className="sub-title mb-15 opacity-7">Get In Touch</h6>
            <h2 className="fz-50">Let's bring your vision to life!</h2>
            <p className="fz-15 mt-10">
              Whether you're looking to start a new project, enhance your digital presence, 
              or just want to chat, I'm here for you. Reach out, and let's make something great together!
            </p>
            <div className="phone fz-30 fw-600 mt-30 underline">
              <a href="https://wa.me/+94719153552" className="main-color">
                +94 719 153 552
              </a>
            </div>
            <ul className="rest social-text d-flex mt-60">
              <li className="mr-30">
                <a href="https://www.linkedin.com/in/chamudithaperera" className="hover-this">
                  <span className="hover-anim">LinkedIn</span>
                </a>
              </li>
              <li className="mr-30">
                <a href="https://github.com/chamudithaperera" className="hover-this">
                  <span className="hover-anim">GitHub</span>
                </a>
              </li>
              <li className="mr-30">
                <a href="https://www.facebook.com/chamuditha.kavishan.1" className="hover-this">
                  <span className="hover-anim">Facebook</span>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/chamuditha_kavishan/" className="hover-this">
                  <span className="hover-anim">Instagram</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-lg-7 valign">
          <div className="full-width wow fadeIn">
            <form id="contact-form" onSubmit={handleSubmit}>
              {status.message && (
                <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                  {status.message}
                </div>
              )}

              <div className="controls row">
                <div className="col-lg-6">
                  <div className="form-group mb-30">
                    <input
                      id="form_name"
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group mb-30">
                    <input
                      id="form_email"
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-group mb-30">
                    <input
                      id="form_subject"
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-group">
                    <textarea
                      id="form_message"
                      name="message"
                      placeholder="Message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      required
                    ></textarea>
                  </div>
                  <div className="mt-30">
                    <button type="submit" disabled={isSubmitting} href="mailto:chamudithaperera.dev@gmail.com">
                      <span className="text">
                        {isSubmitting ? (
                          <>
                            <span className="spinner"></span> Sending...
                          </>
                        ) : (
                          'Send A Message'
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Info;
