// Multiplayer room page placeholder for realtime match sessions.
interface RoomPageProps {
  params: {
    id: string
  }
}

export default function RoomPage({ params }: RoomPageProps): JSX.Element {
  return <main>Room placeholder for {params.id}.</main>
}
