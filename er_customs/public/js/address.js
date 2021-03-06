frappe.ui.form.on('Address', {
  refresh(frm) {
    frm.events.add_get_address_btn(frm)
  },
  add_get_address_btn(frm) {
    if (!!frm.doc.__unsaved) {
      frm.add_custom_button(('Buscar Endereço'),
        () => frm.events.get_address(frm))
    }
  },
  get_address(frm) {
    frm.events.clear_fields(frm)
    frm.events._validate(frm)
    frm.events.get(frm)
  },
  clear_fields(frm) {
    frm.doc.address_line1 = null
    frm.doc.county = null
    frm.doc.pincode = null
    frm.doc.city = null
    frm.doc.state = null
    frm.refresh()
  },
  _validate(frm) {
    // This try/catch handle undefined index
    try {
      frm.doc.links[0].link_name
    } catch (e) {
      frappe.throw('Aponte o cliente na tabela Referência')
    }
    if (frm.doc.links[0].link_doctype.toLowerCase() !== 'customer') {
      frappe.throw('O tipo de link na tabela de referência deve ser Cliente')
    }
  },
  get(frm) {
    frappe.show_alert({
      message: 'Buscando endereço...',
      indicator: 'orange'
    })
    frappe.call({
      method: 'jaiminho.jaiminho.api.get_address',
      args: {
        customer_link: frm.doc.links[0].link_name
      },
      callback(r) {
        const data = r.message
        frm.doc.address_line1 = `${data.logradouro}, ${data.numero}`
        frm.doc.county = data.bairro
        frm.doc.pincode = data.cep
        frm.doc.city = data.municipio
        frm.doc.state = data.uf
        frm.refresh()
        frappe.show_alert({
          message: 'Operação concluída!',
          indicator: 'green'
        })
      }
    })
  }
})