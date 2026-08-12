import { Link } from 'react-router-dom'
import potholeHero from '../assets/photo_5960554355423382880_y (1).jpg'

const categories = [
  'Road',
  'Drainage',
  'Streetlight',
  'Waste',
  'Water Supply',
  'Flooding',
  'Public Infrastructure',
  'Other',
]

function Home() {
  return (
    <div className="space-y-14 pb-8">
      <section className="overflow-hidden rounded-[32px] border border-emerald-100 bg-white shadow-[0_25px_80px_-35px_rgba(22,61,42,0.35)]">
        <div className="grid gap-10 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10 lg:p-12">
          <div className="flex flex-col justify-center">
            <span className="mb-5 inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-800">
              Country Pipu
            </span>
            <h1 className="max-w-xl text-4xl font-black tracking-[-0.06em] text-slate-900 sm:text-5xl lg:text-6xl">
              See a problem? Report it.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
              Help improve your community by reporting potholes, broken infrastructure, flooding, waste, and other civic issues.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/report" className="btn-primary">Report an Issue</Link>
              <Link to="/status" className="btn-secondary">Check Report Status</Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-slate-500">
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />51 neighborhoods served</span>
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" />Live local updates</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-8 h-32 w-32 rounded-full bg-emerald-100 blur-3xl" />
            <div className="absolute -right-4 bottom-8 h-32 w-32 rounded-full bg-amber-100 blur-3xl" />

            <div className="relative rounded-[28px] border border-emerald-700/40 bg-[#143d2e] p-5 text-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-emerald-300/20 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-emerald-100/80">City response</p>
                  <p className="mt-2 text-2xl font-bold text-white">4.8k issues</p>
                </div>
                <div className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-semibold text-emerald-200">
                  +12% this month
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-emerald-100/80">Resolved</p>
                  <p className="mt-2 text-3xl font-bold text-white">64%</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-emerald-100/80">Avg. review</p>
                  <p className="mt-2 text-3xl font-bold text-white">2.1d</p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-white/5 p-4">
                <div className="mb-3 flex items-center justify-between text-sm text-emerald-100/80">
                  <span>Most reported</span>
                  <span>Potholes</span>
                </div>
                <div className="space-y-3">
                  {['Road', 'Flooding', 'Streetlight', 'Waste'].map((item, index) => (
                    <div key={item}>
                      <div className="mb-1 flex items-center justify-between text-xs text-emerald-100/80">
                        <span>{item}</span>
                        <span>{[38, 27, 21, 14][index]}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-emerald-950/40">
                        <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${[38, 27, 21, 14][index]}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[32px] border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-amber-50 p-4 shadow-[0_20px_60px_-35px_rgba(15,118,110,0.35)] md:p-8">
        <div className="grid items-center gap-8 md:grid-cols-[1.05fr_0.95fr]">
          <div className="relative">
            <div className="absolute -left-4 top-6 h-24 w-24 rounded-full bg-emerald-200/80 blur-2xl" />
            <div className="overflow-hidden rounded-[30px] border border-emerald-100 shadow-[0_30px_70px_-25px_rgba(15,118,110,0.35)]">
              <img
                src={potholeHero}
                alt="A pothole in the road surface"
                className="h-[420px] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-5 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-lg backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">This week</p>
              <p className="mt-2 text-2xl font-black text-slate-900">184</p>
              <p className="text-sm text-slate-600">issues reported</p>
            </div>
          </div>

          <div className="space-y-6 p-2">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Community action</p>
            <h2 className="text-3xl font-black tracking-[-0.05em] text-slate-900 sm:text-4xl">
              Real issues. Visible solutions. Better neighborhoods.
            </h2>
            <p className="text-lg leading-8 text-slate-600">
              From potholes on busy routes to broken streetlights and blocked drains, residents can quickly flag what needs attention and help local teams prioritize the most urgent fixes.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['1.2k+', 'Reports'],
                ['92%', 'Resolved'],
                ['48h', 'Avg. response'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                  <p className="text-2xl font-black text-slate-900">{value}</p>
                  <p className="mt-1 text-sm text-slate-600">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">How it works</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-900">Simple, fast, and built for the field</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ['01', 'Report', 'Capture the issue, add a photo, and describe what happened.'],
            ['02', 'Verify', 'Use your live location so teams know exactly where to respond.'],
            ['03', 'Track', 'Monitor progress and see updates from submission to resolution.'],
          ].map(([step, title, body]) => (
            <div key={step} className="rounded-[24px] border border-emerald-100 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-sm font-bold text-emerald-800">{step}</div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3>
              <p className="mt-3 text-slate-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Issue categories</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-900">Common issues reported across the city</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div key={category} className="rounded-[22px] border border-emerald-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-lg">📍</div>
              <p className="font-semibold text-slate-800">{category}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] bg-[#143d2e] p-8 text-white shadow-[0_30px_80px_-35px_rgba(11,56,44,0.7)] md:p-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-200">Why report?</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white">Faster fixes, safer streets, stronger communities.</h2>
          </div>
          <ul className="space-y-4 text-slate-200">
            {['Improves public services and infrastructure.', 'Helps city teams prioritize urgent repairs.', 'Makes local issues visible and actionable.'].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 text-emerald-300">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-[30px] border border-emerald-100 bg-white p-8 text-center shadow-sm">
        <h2 className="text-3xl font-bold tracking-[-0.05em] text-slate-900">Ready to make a change?</h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">Report an issue in a few quick steps and help improve your neighborhood.</p>
        <div className="mt-7 flex flex-col justify-center gap-4 sm:flex-row">
          <Link to="/report" className="btn-primary">Report an Issue</Link>
          <Link to="/status" className="btn-secondary">Check Report Status</Link>
        </div>
      </section>
    </div>
  )
}

export default Home
