import { Box } from '@mui/material'
import { styled } from '@mui/material'
import Script from 'next/script'
import { useTranslation } from 'react-i18next'

const StyledChatbot = styled(Box)(({ theme }) => ({
  'df-messenger': {
    '--df-messenger-bot-message': theme.palette.secondary.main,
    '--df-messenger-button-titlebar-color': theme.palette.primary.main,
    '--df-messenger-chat-background-color': theme.palette.background.default,
    '--df-messenger-font-color': theme.palette.customColors.lightPaperBg,
    '--df-messenger-send-icon': theme.palette.primary.main,
    '--df-messenger-user-message': theme.palette.primary.main,
    '--df-messenger-input-box-color': theme.palette.background.paper,
    '--df-messenger-input-font-color': theme.palette.text.primary,
    '--df-messenger-minimized-chat-close-icon-color': theme.palette.primary.main
  }
}))

const ChatBotAI = () => {
  const { t, i18n } = useTranslation()

  return (
    <>
      <StyledChatbot>
        <Script src='https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1'></Script>

        <df-messenger
          intent='WELCOME'
          chat-title={`${t('Support')}`}
          agent-id='edde1cf2-3e87-437b-b398-132a1f222454'
          language-code={i18n.language}
        ></df-messenger>
      </StyledChatbot>
    </>
  )
}

export default ChatBotAI
