// Analysis page placeholder for AI coaching report display.
interface AnalysisPageProps {
  params: {
    id: string
  }
}

export default function AnalysisPage({ params }: AnalysisPageProps): JSX.Element {
  return <main>Analysis placeholder for {params.id}.</main>
}
