import { Badge, Card } from "@opencaribe/ui";
import { getUserById, listMessages } from "@/lib/store";

/**
 * Staff-only read view of one marketplace conversation. Messages are
 * informational copies of what members see in their inbox.
 */
export async function Conversation({
  thread,
  labelFor,
}: {
  thread: { id: string; listingId: string; participantIds: string[]; createdAt: string };
  labelFor: (id: string) => Promise<string>;
}) {
  const [messages, ...labels] = await Promise.all([
    listMessages(thread.id),
    ...thread.participantIds.map((id) => labelFor(id)),
  ]);
  const senderNames = new Map<string, string>();
  for (const message of messages) {
    if (!senderNames.has(message.fromId)) {
      const user = await getUserById(message.fromId);
      senderNames.set(message.fromId, user?.name ?? message.fromId);
    }
  }

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-500">{labels.join(" ↔ ")}</p>
        <Badge tone="neutral">{messages.length}</Badge>
      </div>
      <div className="mt-3 space-y-2">
        {messages.slice(0, 20).map((message) => (
          <p key={message.id} className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-semibold">{senderNames.get(message.fromId)}:</span> {message.body}
          </p>
        ))}
        {messages.length === 0 && <p className="text-xs text-slate-500">No messages.</p>}
      </div>
    </Card>
  );
}
