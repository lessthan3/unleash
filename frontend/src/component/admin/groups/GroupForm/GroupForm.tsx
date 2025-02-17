import React, { FC } from 'react';
import { Button, styled, Tooltip } from '@mui/material';
import { UG_DESC_ID, UG_NAME_ID } from 'utils/testIds';
import Input from 'component/common/Input/Input';
import { IGroupUser } from 'interfaces/group';
import { ConditionallyRender } from 'component/common/ConditionallyRender/ConditionallyRender';
import { GroupFormUsersSelect } from './GroupFormUsersSelect/GroupFormUsersSelect';
import { GroupFormUsersTable } from './GroupFormUsersTable/GroupFormUsersTable';
import { ItemList } from 'component/common/ItemList/ItemList';
import useUiConfig from 'hooks/api/getters/useUiConfig/useUiConfig';
import useAuthSettings from 'hooks/api/getters/useAuthSettings/useAuthSettings';
import { HelpOutline } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const StyledForm = styled('form')(() => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
}));

const StyledInputDescription = styled('p')(({ theme }) => ({
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
}));

const StyledInput = styled(Input)(({ theme }) => ({
    width: '100%',
    maxWidth: theme.spacing(60),
    marginBottom: theme.spacing(2),
}));

const StyledItemList = styled(ItemList)(({ theme }) => ({
    width: '100%',
    maxWidth: theme.spacing(60),
    marginBottom: theme.spacing(2),
}));

const StyledGroupFormUsersTableWrapper = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(6),
}));

const StyledButtonContainer = styled('div')(() => ({
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'flex-end',
}));

const StyledCancelButton = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(3),
}));

const StyledDescriptionBlock = styled('div')(({ theme }) => ({
    width: '100%',
    maxWidth: theme.spacing(60),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.neutral.light,
    color: theme.palette.grey[900],
    fontSize: theme.fontSizes.smallBody,
    borderRadius: theme.shape.borderRadiusMedium,
}));

const StyledHelpOutline = styled(HelpOutline)(({ theme }) => ({
    fontSize: theme.fontSizes.smallBody,
    marginLeft: '0.3rem',
    color: theme.palette.grey[700],
}));

interface IGroupForm {
    name: string;
    description: string;
    mappingsSSO: string[];
    users: IGroupUser[];
    setName: (name: string) => void;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    setMappingsSSO: React.Dispatch<React.SetStateAction<string[]>>;
    setUsers: React.Dispatch<React.SetStateAction<IGroupUser[]>>;
    handleSubmit: (e: any) => void;
    handleCancel: () => void;
    errors: { [key: string]: string };
    mode: 'Create' | 'Edit';
}

export const GroupForm: FC<IGroupForm> = ({
    name,
    description,
    mappingsSSO,
    users,
    setName,
    setDescription,
    setMappingsSSO,
    setUsers,
    handleSubmit,
    handleCancel,
    errors,
    mode,
    children,
}) => {
    const { uiConfig, isOss } = useUiConfig();

    const { config: oidcSettings } = useAuthSettings('oidc');
    const { config: samlSettings } = useAuthSettings('saml');

    const isGroupSyncingEnabled =
        (oidcSettings?.enabled && oidcSettings.enableGroupSyncing) ||
        (samlSettings?.enabled && samlSettings.enableGroupSyncing);

    return (
        <StyledForm onSubmit={handleSubmit}>
            <div>
                <StyledInputDescription>
                    What would you like to call your group?
                </StyledInputDescription>
                <StyledInput
                    autoFocus
                    label="Name"
                    id="group-name"
                    error={Boolean(errors.name)}
                    errorText={errors.name}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    data-testid={UG_NAME_ID}
                    required
                />
                <StyledInputDescription>
                    How would you describe your group?
                </StyledInputDescription>
                <StyledInput
                    multiline
                    rows={4}
                    label="Description"
                    placeholder="A short description of the group"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    data-testid={UG_DESC_ID}
                />
                <ConditionallyRender
                    condition={
                        Boolean(uiConfig.flags.syncSSOGroups) && !isOss()
                    }
                    show={
                        <ConditionallyRender
                            condition={isGroupSyncingEnabled}
                            show={
                                <>
                                    <StyledInputDescription>
                                        Is this group associated with SSO
                                        groups?
                                    </StyledInputDescription>
                                    <StyledItemList
                                        label="SSO group ID / name"
                                        value={mappingsSSO}
                                        onChange={setMappingsSSO}
                                    />
                                </>
                            }
                            elseShow={() => (
                                <StyledDescriptionBlock>
                                    <div>
                                        You can enable SSO groups syncronization
                                        if needed
                                        <Tooltip
                                            title="You can enable SSO groups
                                            syncronization if needed"
                                            arrow
                                        >
                                            <StyledHelpOutline />
                                        </Tooltip>
                                    </div>
                                    <Link data-loading to={`/admin/auth`}>
                                        <span data-loading>
                                            View SSO configuration
                                        </span>
                                    </Link>
                                </StyledDescriptionBlock>
                            )}
                        />
                    }
                />
                <ConditionallyRender
                    condition={mode === 'Create'}
                    show={
                        <>
                            <StyledInputDescription>
                                Add users to this group
                            </StyledInputDescription>
                            <GroupFormUsersSelect
                                users={users}
                                setUsers={setUsers}
                            />
                            <StyledGroupFormUsersTableWrapper>
                                <GroupFormUsersTable
                                    users={users}
                                    setUsers={setUsers}
                                />
                            </StyledGroupFormUsersTableWrapper>
                        </>
                    }
                />
            </div>

            <StyledButtonContainer>
                {children}
                <StyledCancelButton onClick={handleCancel}>
                    Cancel
                </StyledCancelButton>
            </StyledButtonContainer>
        </StyledForm>
    );
};
