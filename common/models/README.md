# Models Descriptions

## Sala
- Públic: `False`
- Attributes
  * localizacao : **geopoint** `Required`
  * capacidade : **number** `Required`, default=`0`
  * tipo : *string* `Required`, default=`"normal"`
  * restrita : **boolean** `Required`, default=`false`
- ACLs
  * All permissions not specified is `DENY`
- Relations
  * Belongs to : **Bloco**

## Bloco
- Públic: `True`
- Attributes
  * localizacao : **geopoint** `Required`
  * tamanho : **number** `Required`, default=`0`
- ACLs
  * All permissions not specified is `DENY`
  * **$authenticated** ROLE have all READ operations
  * **admin** ROLE have all EXECUTE, READ and WRITE operations
- Relations
  * Has many : **Sala** `nestRemoting`, `disableInclude`