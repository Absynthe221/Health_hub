import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Demo user check
        if (credentials?.email === 'admin@healthhub.com' && credentials?.password === 'password123') {
          return {
            id: '1',
            name: 'Admin User',
            email: 'admin@healthhub.com',
            role: 'admin'
          }
        } else if (credentials?.email === 'instructor@healthhub.com' && credentials?.password === 'password123') {
          return {
            id: '2',
            name: 'Instructor User',
            email: 'instructor@healthhub.com',
            role: 'instructor'
          }
        } else if (credentials?.email === 'student@healthhub.com' && credentials?.password === 'password123') {
          return {
            id: '3',
            name: 'Student User',
            email: 'student@healthhub.com',
            role: 'learner'
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role
      }
      return session
    }
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }