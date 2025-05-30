import { observer } from "mobx-react-lite"
import { IContact } from "../util/entity/contact"
import { ContactItem } from "./ContactItem"
import { contactsStore } from "../util/stores/contactsStore"

export const ContactsList: React.FC = observer(() => {
    return <> 
      {contactsStore.data.map((contact: IContact) => (<ContactItem contact={contact}/>))}
    </>
})

