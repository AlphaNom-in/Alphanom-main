'use client'

export function AlphaNomSpinner() {
  return (
    <>
      <style>{`
        @keyframes anSpinFwd { to { transform: rotate(360deg); } }
        @keyframes anSpinRev { to { transform: rotate(-360deg); } }
      `}</style>
      <span
        style={{
          position: 'relative',
          width: '24px',
          height: '24px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {/* Outer white ring */}
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2.5px solid rgba(255,255,255,0.2)',
            borderTopColor: '#ffffff',
            animation: 'anSpinFwd 0.75s linear infinite',
          }}
        />
        {/* Inner teal ring — counter-rotates */}
        <span
          style={{
            position: 'absolute',
            inset: '4px',
            borderRadius: '50%',
            border: '1.5px solid rgba(15,185,177,0.3)',
            borderBottomColor: '#0FB9B1',
            animation: 'anSpinRev 1.1s linear infinite',
          }}
        />
        {/* AlphaNom logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo.png"
          alt=""
          width={13}
          height={13}
          style={{ display: 'block', position: 'relative', zIndex: 1 }}
        />
      </span>
    </>
  )
}
