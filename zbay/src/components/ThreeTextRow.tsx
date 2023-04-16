export default function ThreeTextRow({t1, t2, t3}: {t1: string | number, t2: string | number, t3: string | number}) {
    return <div className='m-auto flex flex-row items-center justify-between text-green-600 space-x-5 p-5 bg-slate-900 rounded-md'>
        <p className='max-w-xs px-auto'>{t1}</p>
        <p className=''>{t2}</p>
        <p className=''>{t3}</p>
    </div>
}