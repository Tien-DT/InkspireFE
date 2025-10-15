import { DraggableCardBody, DraggableCardContainer } from '~/components/ui/draggable-card'
import inkun from '~/assets/Untitled design.jpg'
import inkun2 from '~/assets/Inkun-Wave.png'
import inkun3 from '~/assets/Inkun-Face.png'
import inkun4 from '~/assets/Gemini_Generated_Image_54ielh54ielh54ie.png'
import inkun5 from '~/assets/Gemini_Generated_Image_ifomm8ifomm8ifom.png'
import inkun6 from '~/assets/Gemini_Generated_Image_q1f7oaq1f7oaq1f7.png'

type ShowcaseItem = {
  title: string
  image: string
  className: string
}

const items: ShowcaseItem[] = [
  {
    title: 'Tyler Durden',
    image: inkun3,
    className: 'absolute top-10 left-[20%] rotate-[-5deg]'
  },
  {
    title: 'The Narrator',
    image: inkun4,
    className: 'absolute top-40 left-[25%] rotate-[-7deg]'
  },
  {
    title: 'Iceland',
    image: inkun5,
    className: 'absolute top-5 left-[40%] rotate-[8deg]'
  },
  {
    title: 'Japan',
    image: inkun6,
    className: 'absolute top-32 left-[55%] rotate-[10deg]'
  },
  {
    title: 'New Zealand',
    image: inkun2,
    className: 'absolute top-24 left-[45%] rotate-[-7deg]'
  },
  {
    title: 'Inkun nè',
    image: inkun,
    className: 'absolute top-8 left-[30%] rotate-[4deg]'
  }
]

export function JobsShowcase() {
  return (
    <section className='relative hidden min-h-screen w-full items-center justify-center overflow-hidden bg-neutral-950 lg:flex'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15)_0%,rgba(17,24,39,1)_60%)]' />
      <div className='pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-emerald-500/30 blur-3xl' />
      <div className='pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-sky-500/30 blur-3xl' />
      <div className='relative z-10 w-full max-w-6xl px-6 py-20'>
        <DraggableCardContainer className='relative flex min-h-[75vh] w-full items-center justify-center overflow-visible'>
          <p className='absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl font-black text-neutral-500 md:text-4xl'>
            If its your first day at Fight Club, you have to fight.
          </p>
          {items.map((item) => (
            <DraggableCardBody key={item.title} className={item.className}>
              <img
                src={item.image}
                alt={item.title}
                className='pointer-events-none relative z-10 h-80 w-80 rounded-md object-cover shadow-xl'
              />
              <h3 className='mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-200'>
                {item.title}
              </h3>
            </DraggableCardBody>
          ))}
        </DraggableCardContainer>
      </div>
    </section>
  )
}
