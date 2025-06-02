import { observer } from "mobx-react-lite"
import { ContactItem } from "./ContactItem"
import { contactsStore } from "../util/stores/contacts.store"
import { IContact } from "../util/entity/contact.entity"
import React from "react"


export const ContactsList: React.FC = observer(() => {
    return <>
      {contactsStore.contactsIds.map((id: string) => (<ContactItem key={id} id={id}/>))}
    </>
});
