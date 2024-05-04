import { User } from "firebase/auth"

const getRecipientEmail = (users: any[], userLoggedIn: User | null | undefined) => (
    users?.filter((userToFilter: any) => userToFilter !== userLoggedIn?.email)[0]
)

export default getRecipientEmail