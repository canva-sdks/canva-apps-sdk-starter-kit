import React from "react";
import {
  Avatar,
  Button,
  Columns,
  Column,
  Rows,
  Title,
  Text,
  Box,
  FlyoutMenu,
  FlyoutMenuItem,
  FlyoutMenuDivider,
  CheckIcon,
  PlusIcon,
  CogIcon,
  LinkButton,
  ArrowLeftIcon,
  Alert,
} from "@canva/app-ui-kit";
import type { OauthAccount } from "@canva/user";

export enum View {
  Switcher = "Switcher",
  Manage = "Manage",
}

type AccountSwitcherMenuItemProps =
  | {
      account: OauthAccount;
      isActive: boolean;
      variant: View.Switcher;
      onSwitch: () => void;
      onSignInAgain: () => void;
    }
  | {
      account: OauthAccount;
      isActive: boolean;
      variant: View.Manage;
      onDisconnect: () => void;
    };

const AccountSwitcherMenuItem = (props: AccountSwitcherMenuItemProps) => {
  const { account, isActive } = props;
  const variant = props.variant ?? View.Switcher;

  const avatar = (
    <Avatar name={account.displayName} photo={account.avatarUrl} />
  );

  const nameAndEmail = (
    <Rows spacing="0">
      <Columns spacing="1u" alignY="center">
        <Column>
          <Text size="medium" tone="primary">
            {account.displayName}{" "}
            {isActive && variant === View.Manage ? "(Current)" : ""}
          </Text>
        </Column>
      </Columns>
      <Text size="small" tone="tertiary">
        {account.principal}
      </Text>
    </Rows>
  );

  if (variant === View.Manage) {
    const { onDisconnect } = props as Extract<
      AccountSwitcherMenuItemProps,
      { variant: View.Manage }
    >;
    const getEndContent = () => {
      return (
        <Text size="small" tone="critical">
          <LinkButton onClick={() => onDisconnect()}>
            <span
              style={{
                color: "var(--ui-kit-color-feedback-critical-bg)",
                textDecoration: "underline",
              }}
            >
              Disconnect
            </span>
          </LinkButton>
        </Text>
      );
    };

    return (
      <Box paddingY="1u" paddingX="2u">
        <Columns spacing="1u" align="spaceBetween" alignY="center">
          <Column>
            <Columns spacing="1u" alignY="center">
              <Column width="content">{avatar}</Column>
              <Column>{nameAndEmail}</Column>
            </Columns>
          </Column>
          <Column width="content">{getEndContent()}</Column>
        </Columns>
      </Box>
    );
  }

  // Switcher view
  const { onSwitch } = props as Extract<
    AccountSwitcherMenuItemProps,
    { variant: View.Switcher }
  >;
  const getEndContent = () => {
    if (isActive) {
      return <CheckIcon />;
    }
    return null;
  };

  const handleClick = () => {
    if (isActive) {
      return;
    }
    onSwitch();
  };

  return (
    <FlyoutMenuItem
      start={avatar}
      end={getEndContent()}
      onClick={handleClick}
      disabled={isActive}
    >
      {nameAndEmail}
    </FlyoutMenuItem>
  );
};

const AccountSwitcherView = ({
  accounts,
  selectedAccountId,
  onAccountSwitch,
  onSignInAgain,
  appName,
}: {
  accounts: OauthAccount[];
  selectedAccountId: string | null;
  onAccountSwitch: (accountId: string) => void;
  onSignInAgain: (accountId: string) => void;
  appName: string;
}) => {
  return (
    <>
      <FlyoutMenuDivider>{`Switch ${appName} accounts`}</FlyoutMenuDivider>
      {accounts.map((account) => (
        <AccountSwitcherMenuItem
          key={account.id}
          account={account}
          isActive={account.id === selectedAccountId}
          variant={View.Switcher}
          onSwitch={() => onAccountSwitch(account.id)}
          onSignInAgain={() => onSignInAgain(account.id)}
        />
      ))}
    </>
  );
};

const AccountSwitcherFooter = ({
  accounts,
  onAddAccount,
  onManageAccounts,
}: {
  accounts: OauthAccount[];
  onAddAccount: () => void;
  onManageAccounts: () => void;
}) => {
  return (
    <>
      <FlyoutMenuDivider />
      {accounts.length >= 4 ? (
        <Box paddingX="1u" paddingBottom="0.5u">
          <Alert tone="info" title="You've reached the limit.">
            <br />
            Remove an account to add a new one.
          </Alert>
        </Box>
      ) : (
        <FlyoutMenuItem start={<PlusIcon />} onClick={onAddAccount}>
          Add another account
        </FlyoutMenuItem>
      )}
      <FlyoutMenuItem start={<CogIcon />} onClick={() => onManageAccounts()}>
        Manage accounts
      </FlyoutMenuItem>
    </>
  );
};

const ManageAccountsView = ({
  accounts,
  selectedAccountId,
  onDisconnect,
  onBack,
  appName,
}: {
  accounts: OauthAccount[];
  selectedAccountId: string | null;
  onDisconnect: (accountId: string) => void;
  onBack: () => void;
  appName: string;
}) => {
  return (
    <>
      <Box paddingX="1u">
        <Columns spacing="1u" alignY="center">
          <Column width="containedContent">
            <Button
              variant="tertiary"
              size="small"
              icon={ArrowLeftIcon}
              onClick={() => onBack()}
              ariaLabel="Go back"
            />
          </Column>
          <Column>
            <Title size="xsmall">Manage {appName} accounts</Title>
          </Column>
        </Columns>
      </Box>
      <FlyoutMenuDivider />
      <Rows spacing="0">
        {accounts.map((account) => (
          <AccountSwitcherMenuItem
            key={account.id}
            account={account}
            isActive={account.id === selectedAccountId}
            variant={View.Manage}
            onDisconnect={() => onDisconnect(account.id)}
          />
        ))}
      </Rows>
    </>
  );
};

export interface AccountSelectorProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  accounts: OauthAccount[];
  selectedAccountId: string | null;
  triggerLabel: string;
  appName: string;
  onAccountSwitch: (accountId: string) => void;
  onAddAccount: () => void;
  onSignInAgain: (accountId: string) => void;
  onManageAccounts: () => void;
  onBack: () => void;
  onDisconnect: (accountId: string) => void;
}

export const AccountSelector = ({
  currentView,
  setCurrentView,
  accounts,
  selectedAccountId,
  triggerLabel,
  appName,
  onAccountSwitch,
  onAddAccount,
  onSignInAgain,
  onManageAccounts,
  onBack,
  onDisconnect,
}: AccountSelectorProps) => {
  const handleManageAccounts = () => {
    setCurrentView(View.Manage);
    onManageAccounts();
  };

  const handleBack = () => {
    if (currentView === View.Manage) {
      setCurrentView(View.Switcher);
      onBack();
    }
  };

  const handleAccountSwitch = (accountId: string) => {
    onAccountSwitch(accountId);
  };

  const renderContent = () => {
    if (currentView === View.Switcher) {
      return (
        <>
          <AccountSwitcherView
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onAccountSwitch={handleAccountSwitch}
            onSignInAgain={onSignInAgain}
            appName={appName}
          />
          <AccountSwitcherFooter
            accounts={accounts}
            onAddAccount={onAddAccount}
            onManageAccounts={handleManageAccounts}
          />
        </>
      );
    }

    if (currentView === View.Manage) {
      return (
        <ManageAccountsView
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onDisconnect={onDisconnect}
          onBack={handleBack}
          appName={appName}
        />
      );
    }

    return null;
  };

  const handleClose = () => {
    // Reset to switcher view when flyout closes
    setCurrentView(View.Switcher);
  };

  return (
    <Box>
      <FlyoutMenu
        label={triggerLabel}
        flyoutPlacement="bottom-start"
        onClose={handleClose}
      >
        {renderContent()}
      </FlyoutMenu>
    </Box>
  );
};
