import { isServerEOL } from "cfx/base/serverUtils";
import { useServiceOptional } from "cfx/base/servicesContainer";
import { $L } from "cfx/common/services/intl/l10n";
import { IServersConnectService } from "cfx/common/services/servers/serversConnect.service";
import { IServerView } from "cfx/common/services/servers/types";
import { noop } from "cfx/utils/functional";
import { playSfx, Sfx } from "cfx/apps/mpMenu/utils/sfx";
import { observer } from "mobx-react-lite";
import { Title } from "cfx/ui/Title/Title";
import { Button, ButtonProps } from "cfx/ui/Button/Button";
import { ReactNode } from "react";
import { stopPropagation } from "cfx/utils/domEvents";
import { isServerOffline } from "../ServerListItem/utils";

export interface ServerConnectButtonProps {
  server: IServerView,

  size?: ButtonProps['size'],
  theme?: ButtonProps['theme'],
}

export const ServerConnectButton = observer(function ServerConnectButton(props: ServerConnectButtonProps) {
  const {
    server,
    size = 'large',
    theme = "primary",
  } = props;

  const ServersConnectService = useServiceOptional(IServersConnectService);

  let title: ReactNode;

  if (!server.manuallyEnteredEndPoint) {
    switch (true) {
      case !ServersConnectService: {
        title = 'No ServersConnectService, unable to connect';
        break;
      }

      case !!server.private: {
        title = $L('#ServerDetail_PrivateDisable');
        break;
      }
      case isServerEOL(server): {
        title = $L('#ServerDetail_EOLDisable');
        break;
      }

      case isServerOffline(server): {
        title = $L('#ServerDetail_OfflineDisable');
        break;
      }
    }
  }

  const disabled = Boolean(title) || !ServersConnectService?.canConnect;

  const handleClick = ServersConnectService
    ? () => {
      if (__CFXUI_USE_SOUNDS__) {
        playSfx(Sfx.Connect);
      }

      ServersConnectService.connectTo(server);
    }
    : noop;

  return (
    <Title fixedOn="bottom-left" title={title}>
      <Button
        size={size}
        theme={theme}
        disabled={disabled}
        text={$L('#DirectConnect_Connect')}
        onClick={stopPropagation(handleClick)}
      />
    </Title>
  );
});