import { observer } from "mobx-react-lite"
import { ContactItem } from "./ContactItem"
import { contactsStore } from "../util/stores/contactsStore"
import { IContact } from "../util/entity/contact"
import React from "react"

export const ContactsList: React.FC = observer(() => {
    return <> 
      {contactsStore.data.map((contact: IContact) => (<ContactItem key={contact.id} contact={contact}/>))}
    </>
})

