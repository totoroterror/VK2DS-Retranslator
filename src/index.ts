import { Logger, Color, TextStyle } from '@nekoteam/logger'
import { ColorResolvable, EmbedBuilder, WebhookClient } from 'discord.js'
import express from 'express'
import escape from 'markdown-escape'

import config from './config'

const app = express()

const webhook = new WebhookClient({ url: config.webhook.url })

const logger = Logger.create('general', Color.Gray)

app.disable('x-forwarded-for')
app.enable('trust proxy')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/', (req, res) => {
  if (!req.body) {
    res.status(400).send({ code: 400, message: 'Bad Request' })

    return
  }

  const { secret, type, object } = req.body

  if (secret !== config.callback.secret) {
    res.status(401).send({ code: 403, message: 'Unauthorized' })

    return
  }

  switch (type) {
  case 'confirmation': {
    res.send(config.callback.confirmation)

    break
  }
  case 'wall_post_new': {
    const { text, attachments } = object
    const attachmentsByTypes = {
      photos: (attachments ?? []).filter((attachment: any) => attachment.type === 'photo'),
      other: (attachments ?? []).filter((attachment: any) => attachment.type !== 'photo'),
    }

    const [thumbnail, ...otherPhotos] = attachmentsByTypes.photos ?? []

    const formattedAttachments = [...otherPhotos, ...attachmentsByTypes.other].map((attachment: any) => {
      const content = attachment[attachment.type]

      switch (attachment.type) {
      case 'photo':
        return `[📷 Фото](https://vk.com/photo${content.owner_id}_${content.id})`
      case 'video':
        return `[📹 ${content.title ?? 'Видео'}](https://vk.com/video${content.owner_id}_${content.id})`
      case 'audio':
        return `[🎵 ${content.artist ?? 'Исполнитель'} - ${content.title ?? 'Название'}](https://vk.com/audio${content.owner_id}_${content.id})`
      case 'doc':
        return `[📁 ${content.title ?? 'Документ'}](https://vk.com/doc${content.owner_id}_${content.id})`
      case 'link':
        return `[🔗 ${content.title ?? 'Ссылка'}](${content.url})`
      case 'post':
        return `[📝 Пост](https://vk.com/wall${content.owner_id}_${content.id})`
      default: {
        return `👻 Неподдерживаемый тип (${attachment.type})`
      }
      }
    })

    const splittedText: string[] = (text ?? '').replace(/\r/g, '').split('\n').map((line: string) => escape(line.trim()))
    const [header, ...otherText] = [...splittedText]

    const formattedText = [`${header ? `**${header}**` : ''}`, ...otherText, `${formattedAttachments.length > 0 ? '**Вложения:**' : ''}`, ...formattedAttachments].join('\n').replace(/\n{2,}/g, '\n\n').replace(/\n+$/, '')

    if (formattedText.length > 0) {
      const embed: EmbedBuilder = new EmbedBuilder()
        .setAuthor({
          name: config.webhook.title,
          iconURL: config.webhook.picture,
        })
        .setColor(config.webhook.color as ColorResolvable)
        .setDescription(formattedText)
        .setImage(thumbnail ? thumbnail.photo.sizes[thumbnail.photo.sizes.length - 1].url : undefined)

      webhook.send({
        embeds: [embed],
      })
    }

    res.send('OK')

    break
  }

  default: {
    logger('Unsupported type', req.body)

    res.send('OK')
    break
  }
  }
})

const init = async () => {
  logger(`starting ${Logger.color(config.package.name!, Color.Blue, TextStyle.Bold)} ${Logger.color(`(${config.package.version})`, Color.Blue)}...`)

  app.listen(config.web.port, config.web.host, () => logger(`listening on ${Logger.color(`http://${config.web.host}:${config.web.port}`, Color.Blue)}`))
}

init()
  .catch(logger.error)
