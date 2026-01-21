const lightbox = document.getElementById('image-lightbox')
const lightboxImg = document.getElementById('lightbox-img')
const lightboxCaption = document.getElementById('lightbox-caption')

function openLightbox(img) {
  const figure = img.closest('figure')
  const caption = figure ? figure.querySelector('figcaption') : null
  const projectCard = img.closest('.project-card')

  lightboxImg.src = img.src
  lightboxImg.alt = img.alt || 'Image preview'
  lightboxCaption.innerHTML = ''

  if (caption) {
    const clone = caption.cloneNode(true)
    clone.removeAttribute('class')
    clone.querySelectorAll('[class]').forEach((el) => el.removeAttribute('class'))
    lightboxCaption.appendChild(clone)
  } else if (projectCard) {
    const title = projectCard.querySelector('h3')
    const paragraphs = projectCard.querySelectorAll('p')

    if (title) {
      const titleEl = document.createElement('div')
      titleEl.textContent = title.textContent
      titleEl.style.fontWeight = '600'
      titleEl.style.marginBottom = '6px'
      lightboxCaption.appendChild(titleEl)
    }

    paragraphs.forEach((p) => {
      const el = document.createElement('p')
      el.textContent = p.textContent
      el.style.marginTop = '6px'
      lightboxCaption.appendChild(el)
    })
  } else {
    lightboxCaption.textContent = img.alt || ''
  }

  lightbox.classList.add('is-open')
  lightbox.setAttribute('aria-hidden', 'false')
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightbox.classList.remove('is-open')
  lightbox.setAttribute('aria-hidden', 'true')
  lightboxImg.src = ''
  lightboxCaption.textContent = ''
  document.body.style.overflow = ''
}

document.querySelectorAll('img.zoomable').forEach((img) => {
  img.addEventListener('click', (event) => {
    event.preventDefault()
    openLightbox(img)
  })
})

lightbox.addEventListener('click', closeLightbox)
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox()
})