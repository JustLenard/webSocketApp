import { Injectable } from '@nestjs/common'
import { AuthenticatedSocket } from 'src/utils/interfaces'

export interface IGatewaySessionManager {
	getUserSocket(id: string): AuthenticatedSocket | undefined
	setUserSocket(id: string, socket: AuthenticatedSocket): void
	removeUserSocket(id: string): void
	// getSockets(): Map<string, AuthenticatedSocket>
	getSockets(): any
}

@Injectable()
export class GatewaySessionManager implements IGatewaySessionManager {
	private readonly sessions: Map<string, AuthenticatedSocket> = new Map()

	getUserSocket(id: string): AuthenticatedSocket | undefined {
		return this.sessions.get(id)
	}

	setUserSocket(userId: string, socket: AuthenticatedSocket) {
		this.sessions.set(userId, socket)
	}
	removeUserSocket(userId: string) {
		this.sessions.delete(userId)
	}
	// getSockets(): Map<string, AuthenticatedSocket> {
	// 	return this.sessions
	// }
	getSockets() {
		const sesions = []
		this.sessions.forEach((session) => sesions.push(session.id))
		return sesions
	}
}
